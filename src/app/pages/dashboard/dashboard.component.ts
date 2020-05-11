import { Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { SolarData } from '../../@core/data/solar';
import { Events } from '../../@data/events';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { Router } from '@angular/router';
import { Monitor, Gitlab, User } from '../../@data/monitor';


interface CardSettings {
	title: string;
	subTitle: string;
	iconClass: string;
	type: string;
}

@Component({
	selector: 'ngx-dashboard',
	styleUrls: ['./dashboard.component.scss'],
	templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnDestroy {

	private alive = true;

	projects: {};

	allProjects: any[] = [];

	solarValue: number;
	projectsCard: CardSettings = {
		title: '# 0',
		subTitle: 'projects',
		iconClass: 'nb-gear',
		type: 'primary',
	};
	usersCard: CardSettings = {
		title: '# 0',
		subTitle: 'users',
		iconClass: 'nb-lightbulb',
		type: 'danger',
	};
	mergeRequestCard: CardSettings = {
		title: '# 0',
		subTitle: 'merge requests',
		iconClass: 'nb-tables',
		type: 'success',
	};
	discussionCard: CardSettings = {
		title: '# 0',
		subTitle: 'pending discussions',
		iconClass: 'nb-paper-plane', // notifications
		type: 'info',
	};
	// 'nb-tables',  'nb-snowy-circled', 'nb-power-circled', 'nb-grid-b-outline',
	statusCards: string;

	commonStatusCardsSet: CardSettings[] = [
		this.projectsCard,
		this.usersCard,
		this.mergeRequestCard,
		this.discussionCard,
	];

	statusCardsByThemes: {
		default: CardSettings[];
		cosmic: CardSettings[];
		corporate: CardSettings[];
		dark: CardSettings[];
	} = {
			default: this.commonStatusCardsSet,
			cosmic: this.commonStatusCardsSet,
			corporate: [
				{
					...this.projectsCard,
					type: 'warning',
				},
				{
					...this.usersCard,
					type: 'primary',
				},
				{
					...this.mergeRequestCard,
					type: 'danger',
				},
				{
					...this.discussionCard,
					type: 'info',
				},
			],
			dark: this.commonStatusCardsSet,
		};

	constructor(private themeService: NbThemeService,
		private events: Events,
		private router: Router,
		private monitor: Monitor,
		private solarService: SolarData) {
		this.themeService.getJsTheme()
			.pipe(takeWhile(() => this.alive))
			.subscribe(theme => {
				this.statusCards = this.statusCardsByThemes[theme.name];
			});

		this.listenForEvents();
		this.events.refreshProjects();
		this.events.refreshUsers();

		this.solarService.getSolarData()
			.pipe(takeWhile(() => this.alive))
			.subscribe((data) => {
				this.solarValue = data;
			});
	}

	ngOnInit() {
		console.log("ok");
		const user = this.monitor.getUser();
		if(!user.auth_code) {
			// this.router.navigate(['/login']);
		}
	}

	listenForEvents() {

		this.events.projects.subscribe((data: any[]) => {
			this.projects = data;
			this.allProjects = [];
			let count = 0, active = 0;
			Object.keys(data).forEach(id => {
				this.allProjects.push(data[id]);
				count++;
				let date = new Date(data[id]['last_activity_at']), today = new Date();
				if (today.getTime() - date.getTime() < 24 * 60 * 60 * 1000) { active++; }
			});
			this.projectsCard.title = `# ${active}`;
			this.projectsCard.subTitle = `of ${count} projects`;
			// sort the projects
			this.allProjects.sort((a, b) => {
				return new Date(b['last_activity_at']).getTime() - new Date(a['last_activity_at']).getTime();
			});
		});
		this.events.users.subscribe(data => {
			this.usersCard.title = `# ${Object.keys(data).length}`;
		});

		this.events.mergeRequests.subscribe(data => {
			let count = 0;
			Object.keys(data).forEach(projectId => {
				data[projectId].forEach(mr => {
					if(mr.state == 'opened') count++;
				});
			});
			this.mergeRequestCard.title = `# ${count}`;
		});
		this.events.mrDiscussions.subscribe(data => {
			let count = 0;
			console.log(data);
			debugger;
			Object.keys(data).forEach(mrId => {
				let discussions = data[mrId];
				discussions.forEach(discussion => {
					let counted = false, resolved = false;
					discussion.notes.forEach(note => {
						counted = counted || !note.system;
						resolved = resolved || note.resolved;
					});
					if(counted && !resolved) count++;
				});
			});
			this.discussionCard.title = `# ${count}`;
		});
	}

	ngOnDestroy() {
		this.alive = false;
	}
}
