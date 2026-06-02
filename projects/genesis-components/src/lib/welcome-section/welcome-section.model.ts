export interface WelcomeSectionOptions {
    actions: Array<WelcomeRoutes>;
}

export interface WelcomeRoutes {
    label: string;
    link?: string;
    icon?: string;
}