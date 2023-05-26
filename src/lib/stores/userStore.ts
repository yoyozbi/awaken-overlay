import {writable} from 'svelte/store';

export const user = writable<{username?: string, id?: string, isAdmin?: boolean}>() 