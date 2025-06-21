export interface MyDetailsRequest {
    email:string,
    name:string,
    specialized:string,
    file?:File|null,
    description:string,
}
