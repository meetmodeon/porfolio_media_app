export interface MyDetailsResponse {
    id?:string,
    email:string|undefined,
    name:string,
    role:string,
    specialized:string,
    returnImg:string,
    returnImageName?:string,
    returnImageType?:string,
    description:string,
    cvFileName?:string,
    cvFile?:string;
}
