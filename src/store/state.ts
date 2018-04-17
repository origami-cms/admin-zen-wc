import {ResourceStateMixin, Field} from 'origami-zen';
import {ImmutableArray, ImmutableObject} from 'seamless-immutable';

export default interface State {
    App: App;
    Pages: ResourceStateMixin<{ pages: ImmutableObject<Page>[] }>;
    Users: ResourceStateMixin<{ users: ImmutableObject<User>[] }>;
    Me: Me;
    Auth: Auth;
    Setup: Setup;
}

export type User = {
    id: string,
    fname: string;
    lname: string;
    email: string;
    password: string;
};

export type Page = {
    id: string;
    title: string
    type?: String;
    url: String;
    data: Object;
    children?: ImmutableArray<Page>;
    properties: {
        [name: string]: Field
    }
};


export interface SidebarItem {
    name: string;
    path: string;
    icon: string;
    color: string;
    iconColor: string;
}
export type App = {
    sidebar: {
        items: SidebarItem[]
    },
    page: {
        title: string;
    },
    tabs: {
        name: string;
        url: string;
    }[]
};


export interface Me {
    fname: string | null;
    lname: string | null;
    email: string | null;
}


export interface Auth {
    loggedIn: string | false;
    token: string | null;
    loading: {
        verifying: string | false;
        loggingIn: string | false;
    };
    errors: {
        loggingIn: string | null;
    };
}


export interface Setup {
    setup: boolean | null;
    user: null | object;
    errors: {
        user: null | string
    };
    loading: {
        user: null | string
    };
}
