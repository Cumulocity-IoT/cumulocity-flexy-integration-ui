import { Injectable } from '@angular/core';
import { IManagedObject } from '@c8y/client';
import { InventoryService } from '@c8y/ngx-components/api';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs';
import { SynchjobModalComponent } from '~components/datamailbox-download/synchjob-modal/synchjob-modal.component';
import { DM_FRAGMENTTYPE_MO } from '../constants/flexy-integration.constants';
import { IOnloadingJobObject } from '../models/c8y-custom-objects.model';

@Injectable({ providedIn: 'root' })
export class SyncOnloadJobService {
  public onDelete: Subject<string> = new Subject();

  constructor(
    private modalService: BsModalService,
    private inventoryService: InventoryService
  ) {}

  async listOnloadingJobs(): Promise<IManagedObject[]> {
    const filter: object = {
      pageSize: 100,
      withTotalPages: true,
      fragmentType: DM_FRAGMENTTYPE_MO,
    };
    const { data } = await this.inventoryService.list(filter);
    return data;
  }

  openModalSynchJob(): Observable<IManagedObject> {
    const modalRef = this.modalService.show(SynchjobModalComponent, {
      // initialState: { isModal: true }, // TODO
      class: 'modal-lg',
    });
    const modal: SynchjobModalComponent = modalRef.content;
    return modal.onClose.asObservable();
  }

  async createOnloadingJob(job: IOnloadingJobObject): Promise<IManagedObject> {
    const partialManagedObj: Partial<IOnloadingJobObject> = job;

    partialManagedObj[DM_FRAGMENTTYPE_MO] = {};
    const newJob = await this.inventoryService.create(partialManagedObj);
    return newJob.data;
  }

  async deleteOnloadingJob(id: string) {
    await this.inventoryService.delete(id);
    this.onDelete.next(id);
  }
}
