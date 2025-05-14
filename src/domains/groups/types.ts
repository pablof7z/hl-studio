export type GroupId = string;

export type GroupScope = 'public' | 'private';
export type GroupAccess = 'open' | 'closed';

export type GroupMetadata = {
    name: string;
    picture: string;
    about: string;
    scope: GroupScope;
    access: GroupAccess;
}