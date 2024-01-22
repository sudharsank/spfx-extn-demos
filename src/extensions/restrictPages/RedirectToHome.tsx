import Dialog, { DialogType, IDialogContentProps } from '@fluentui/react/lib/Dialog';
import { Label } from '@fluentui/react/lib/Label';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { SPFI } from '@pnp/sp';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useHelper } from './helper';

export interface IRedirectToHomeProps {
	sp: SPFI;
	currentUser: string;
}

const modelProps = {
	isBlocking: true
};
const dialogContentProps: IDialogContentProps = {
	type: DialogType.normal,
	title: '',
	subText: '',
	showCloseButton: false,
	styles: {
		content: {
			width: 'auto',
			height: 'auto',
			overflow: 'hidden'
		}
	}
};

const RedirectToHome: React.FC<IRedirectToHomeProps> = (props: IRedirectToHomeProps) => {
	const { getSettings } = useHelper(props.sp);
	const [hideDialog, setHideDialog] = useState<boolean>(false);

	const _closeDialog = () => setHideDialog(true);

	const checkForRedirect = async () => {
		const settings = await getSettings();
		console.log("settings", settings);
		// let pagesToRestrict: string = getValueFromArray(settings, "Title", "RedirectPages", "ConfigValue");
		// let homePage: string = getValueFromArray(settings, "Title", "HomePage", "ConfigValue");
		// let allowedUsers: string = getValueFromArray(settings, "Title", "RPAllowedUsers", "ConfigValue");
		// pagesToRestrict.split(',').forEach((page) => {
		// 	if (window.location.pathname.toLowerCase().indexOf(page.toLowerCase()) > -1) {
		// 		if (allowedUsers.indexOf(props.currentUser) < 0) {
		// 			_closeDialog();
		// 			openURL(homePage, false);
		// 		}
		// 	} else _closeDialog();
		// });
	};

	useEffect(() => {
		(async () => {
			try {
				await checkForRedirect();
			} catch (err) {
				console.log(err);
			}
		})();
	}, []);

	return (
		<div>
			<Dialog
				hidden={hideDialog}
				onDismiss={_closeDialog}
				dialogContentProps={dialogContentProps}
				modalProps={modelProps}
				closeButtonAriaLabel={'Close'}
				minWidth="200px"
				maxWidth="200px">
				<div>
					<Label>Checking for access...</Label>
					<Spinner size={SpinnerSize.large} label="Please wait..." />
				</div>
			</Dialog>
		</div>
	);
};

export default RedirectToHome;