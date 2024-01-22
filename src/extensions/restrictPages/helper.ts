import { SPFI } from '@pnp/sp';
import { useCallback } from 'react';
import { filter } from 'lodash';
import { Navigation } from 'spfx-navigation';

export const useHelper = (sp: SPFI) => {
	const getSettings = useCallback(async (useCache?: boolean): Promise<any[]> => {
		let retItems: any[] = [];
		try {
			retItems = await sp.web.lists.getByTitle('Settings').items
				.select('Title', 'ConfigValue')();
		} catch (err) {
			throw err;
		}
		return retItems;
	}, [sp]);

	const getValueFromArray = (arr: any[], key: string, valToCheck: string, returnKey: string): any => {
		if (arr && arr.length > 0) {
			let fil: any[] = filter(arr, (o: any) => { return o[key].toLowerCase() == valToCheck.toLowerCase(); });
			if (fil && fil.length > 0) {
				return fil[0][returnKey];
			}
		}
		return '';
	};

	const openURL = (url: string, newTab: boolean): void => {
		// if (newTab) window.open(url, newTab ? '_blank' : '');
		// else window.location.href = url;
		if (newTab) window.open(url, newTab ? '_blank' : '');
		else Navigation.navigate(url, false);
	};

	return {
		getSettings,
		getValueFromArray,
		openURL
	}
}