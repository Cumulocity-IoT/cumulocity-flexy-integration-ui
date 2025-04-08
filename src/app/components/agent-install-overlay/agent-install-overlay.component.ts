import { Component, inject, OnInit } from '@angular/core';
import { ModalLabels } from '@c8y/ngx-components';
import { Subject } from 'rxjs';
import { InstallAgentForm } from '../../models/c8y-custom-objects.model';
import { EwonFlexyStructure, FlexyConnectorRelease, FlexySettings } from '../../models/flexy.model';
import { FlexyInstallProgressSteps, FlexyInstallSteps } from '../../models/install.model';
import { FlexyService } from '../../services/flexy.service';

@Component({
  selector: 'agent-install-overlay',
  templateUrl: './agent-install-overlay.component.html',
})
export class AgentInstallOverlayComponent implements OnInit {
  private flexyService = inject(FlexyService);

  showAdvancedOptions = false;
  closeSubject = new Subject<InstallAgentForm>();
  showPassword = false;
  showC8YPassword = false;
  loadingReleases = false;
  offcialReleases: FlexyConnectorRelease[];
  selectedRelease: FlexyConnectorRelease;
  labels: ModalLabels = {
    ok: 'Install Agent',
    cancel: 'Cancel',
  };

  installProcessSteps: FlexyInstallProgressSteps[] = [
    {
      id: FlexyInstallSteps.REQUEST_SN,
      label: 'Reuqest Serial',
      selected: true,
      disabled: true,
    },
    {
      id: FlexyInstallSteps.WAS_CONNECTED,
      label: 'Check if device was already connected via agent',
      selected: true,
    },
    {
      id: FlexyInstallSteps.FILES_EXIST,
      label: 'Check for preexisting files',
      selected: true,
    },
    {
      id: FlexyInstallSteps.DOWNLOAD_FILES,
      label: 'Download files',
      selected: true,
    },
    {
      id: FlexyInstallSteps.CHECK_FILES_DOWNLOAD,
      label: 'Check for downloaded files',
      selected: true,
    },
    {
      id: FlexyInstallSteps.REGISTER_DEVICE,
      label: 'Register device',
      selected: true,
    },
    {
      id: FlexyInstallSteps.REBOOT_DEVICE,
      label: 'Reboot Device',
      selected: true,
    },
    {
      id: FlexyInstallSteps.SEND_CONFIG,
      label: 'Send connection config to device',
      selected: true,
    },
    {
      id: FlexyInstallSteps.ACCEPT_REGISTRATION,
      label: 'Accept device registration',
      selected: true,
    },
    {
      id: FlexyInstallSteps.ADD_EXTERNAL_ID,
      label: 'Add Talk2M external ID',
      selected: true,
    },
  ];

  set devices(devices: EwonFlexyStructure[]) {
    this._devices = devices;
  }

  get devices(): EwonFlexyStructure[] {
    return this._devices;
  }

  set config(config: FlexySettings) {
    this._config = config;
  }

  get config(): FlexySettings {
    return this._config;
  }

  private _devices: EwonFlexyStructure[];
  private _config: FlexySettings = {
    url: {
      connector: '',
      jvmrun: '',
      cumulocity: '',
    },
    deviceUsername: '',
    devicePassword: '',
    c8yHost: '',
    c8yPort: null,
    c8yTenant: '',
    c8yUsername: '',
    c8yPassword: '',
    installProcessSkipSteps: [],
  };

  ngOnInit(): void {
    void this.fetchReleases();
  }

  submit(): void {
    const skipSteps = this.installProcessSteps.filter((s) => s.selected === false).map((s) => s.id);

    this.config.installProcessSkipSteps = skipSteps;

    this.closeSubject.next({ config: this.config, devices: this.devices });
  }

  dismiss(): void {
    this.closeSubject.next(null);
  }

  setRelease(release = this.selectedRelease): void {
    this._config.url = {
      connector: release.jar.download_url,
      jvmrun: release.jvmRun.download_url,
      cumulocity: release.configuration.download_url,
    };
  }

  private async fetchReleases(): Promise<void> {
    this.loadingReleases = true;

    try {
      this.offcialReleases = await this.flexyService.fetchConnectorReleases();
      this.selectedRelease = this.offcialReleases[0];
      this.setRelease();
    } catch (err) {
      console.warn('Could not load release list');
    }

    this.loadingReleases = false;
  }
}
