type Params = Record<string, any>;

export class RouteService<T> {
    public raw: T;

    constructor(routes: T) {
        this.raw = routes;
    }

    public builder(route: string, params: Params): string {
        return route.replace(/:([a-zA-Z]+)/g, (match, paramName) => {
            return params[paramName] !== undefined ? params[paramName] : match;
        });
    }
}
