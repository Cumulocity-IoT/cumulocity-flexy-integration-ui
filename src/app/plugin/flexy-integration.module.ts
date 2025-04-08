import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  CoreModule,
  FormsModule,
  gettext,
  hookActionBar,
  hookComponent,
  hookNavigator,
  hookRoute,
} from '@c8y/ngx-components';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AgentInstallOverlayComponent } from '~components/agent-install-overlay/agent-install-overlay.component';
import { BulkRegistrationComponent } from '~components/bulk-registration/bulk-registration.component';
import { RegisteredCellRendererComponent } from '~components/bulk-registration/registration-device-grid/cell-renderer/registered/registered.cell-renderer.component';
import { RegistrationDeviceGridComponent } from '~components/bulk-registration/registration-device-grid/registration-device-grid.component';
import { DataMailboxDownloadComponent } from '~components/datamailbox-download/datamailbox-download.component';
import { SynchjobCardComponent } from '~components/datamailbox-download/synchjob-card/synchjob-card.component';
import { SynchjobModalComponent } from '~components/datamailbox-download/synchjob-modal/synchjob-modal.component';
import { LoadingSpinnerComponent } from '~components/loading-spinner/loading-spinner.component';
import { SettingsComponent } from '~components/settings/settings.component';
import { Talk2mConnectionStatusComponent } from '~components/talk2m-connection-status/talk2m-connection-status.component';
import {
  FLEXY_DATAMAILBOX_PATH,
  FLEXY_PATH,
  FLEXY_REGISTRATION_PATH,
} from '../constants/flexy-integration.constants';
import { FlexyNavigationFactory } from '../factories/navigation.factory';
import { Talk2mConnectionStatusActionFactory } from '../factories/talk2m-connection-status-action.factory';

const components = [
  AgentInstallOverlayComponent,
  BulkRegistrationComponent,
  DataMailboxDownloadComponent,
  LoadingSpinnerComponent,
  RegistrationDeviceGridComponent,
  SettingsComponent,
  SynchjobCardComponent,
  SynchjobModalComponent,
  Talk2mConnectionStatusComponent,
  // grid
  // - columns
  // RegisteredColumn,
  // - cell renderer
  RegisteredCellRendererComponent,
];

const hooks = [
  // plugin
  hookComponent({
    id: 'hms.flex-integration.plugin',
    label: gettext('HMS Flexy Untegration Plugin'),
    description: gettext('Plugin description text'),
    component: BulkRegistrationComponent,
  }),

  // routes
  hookRoute({
    path: FLEXY_PATH,
    children: [
      // redirects
      {
        path: '',
        pathMatch: 'full',
        redirectTo: FLEXY_REGISTRATION_PATH,
      },
      // paths
      {
        path: FLEXY_REGISTRATION_PATH,
        component: BulkRegistrationComponent,
      },
      {
        path: FLEXY_DATAMAILBOX_PATH,
        component: DataMailboxDownloadComponent,
      },
    ],
  }),

  // navigation
  hookNavigator(FlexyNavigationFactory),
  // hookNavigator({
  //   useClass: FlexyTabFactory,
  //   multi: true
  // })

  // action bar
  hookActionBar(Talk2mConnectionStatusActionFactory),
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BsDropdownModule,
    CoreModule,
    TooltipModule,
    ButtonsModule,
  ],
  declarations: components,
  providers: [...hooks],
})
export class FlexyIntegrationPluginModule {}
