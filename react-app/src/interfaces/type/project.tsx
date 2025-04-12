export interface IProject {
    project_id?: number,
    name?: string,
    tracked_time?: number,
    amount?:number,
    progress?:number,
    access?:string,
    type?:string,
    color?: string | null
}

export interface ProjectResponse {
    projects: IProject[],
    types : string[],
    accesses: string []
}
