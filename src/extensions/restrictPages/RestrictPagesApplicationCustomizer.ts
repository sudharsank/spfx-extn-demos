import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Log } from '@microsoft/sp-core-library';
import {
	BaseApplicationCustomizer, PlaceholderContent, PlaceholderName
} from '@microsoft/sp-application-base';
import { SPFI } from "@pnp/sp";
import * as strings from 'RestrictPagesApplicationCustomizerStrings';
import RedirectToHome from './RedirectToHome';
import { getSP } from './pnp.config';


const LOG_SOURCE: string = 'RestrictPagesApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IRestrictPagesApplicationCustomizerProperties {
	// This is an example; replace with your own property
	testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class RestrictPagesApplicationCustomizer
	extends BaseApplicationCustomizer<IRestrictPagesApplicationCustomizerProperties> {

	private sp: SPFI;
	private static headerPlaceholder: PlaceholderContent | undefined;

	private render() {
		if (this.context.placeholderProvider.placeholderNames.indexOf(PlaceholderName.Top) !== -1) {
			if (!RestrictPagesApplicationCustomizer.headerPlaceholder || !RestrictPagesApplicationCustomizer.headerPlaceholder.domElement) {
				RestrictPagesApplicationCustomizer.headerPlaceholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Top, {
					onDispose: this.onDispose
				});
			}
			this.startReactRender();
		} else {
			console.log(`The following placeholder names are available`, this.context.placeholderProvider.placeholderNames);
		}
	}

	private startReactRender() {
		if (RestrictPagesApplicationCustomizer.headerPlaceholder && RestrictPagesApplicationCustomizer.headerPlaceholder.domElement) {
			const elem: React.ReactElement<{}> = React.createElement(RedirectToHome, {
				sp: this.sp,
				currentUser: this.context.pageContext.user.loginName
			});
			ReactDOM.render(elem, RestrictPagesApplicationCustomizer.headerPlaceholder.domElement);
		} else {
			console.log('DOM element of the header is undefined. Start to re-render.');
			this.render();
		}
	}

	public onInit(): Promise<void> {
		Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);
		this.sp = getSP(this.context);
		this.context.placeholderProvider.changedEvent.add(this, this.startReactRender);
		this.render();
		return Promise.resolve();
	}

	public onDispose() {
		if (RestrictPagesApplicationCustomizer.headerPlaceholder && RestrictPagesApplicationCustomizer.headerPlaceholder.domElement) {
			ReactDOM.unmountComponentAtNode(RestrictPagesApplicationCustomizer.headerPlaceholder.domElement);
		}
	}
}
