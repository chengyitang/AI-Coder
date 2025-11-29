export interface GenerateCodeRequest {
    description: string;
    requirements: string;
}
export interface GenerateCodeResponse {
    code: string;
    language: string;
}
export interface GenerateTestsRequest {
    code: string;
    language: string;
}
export interface GenerateTestsResponse {
    tests: string;
}
