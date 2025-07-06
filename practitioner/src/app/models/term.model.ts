export interface GetLatestTermsParams {
  organizationId?: number;
  language?: string;
  country?: string;
}

  
  export interface Term {
    id: number;
    language: string;
    country: string;
    content: string;
    version: number;
    createdAt: string;   // ISO Date string
    updatedAt: string;   // ISO Date string
    organizationId: number;
  }

export interface TermAccept{
  
    id:number,
    termId: number,
    acceptedAt: string| Date,
    termVersion: number


}

  