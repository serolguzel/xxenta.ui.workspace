import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { OrganizationFormComponent } from '../components/organization-form/organization-form.component';
import { OrganizationService } from '../services/organization.service';
import { DisabledOrganization, OrganizationModel, UpdateOrganization } from '../company.models';
import { CommandResponse } from 'genesis-coreservice';

@Component({
  selector: 'app-organization-create',
  templateUrl: './organization-detail.component.html',
  standalone: true,
  imports: [OrganizationFormComponent],
  providers: [OrganizationService],
})
export class OrganizationDetailComponent implements OnInit {
  data: UpdateOrganization = <UpdateOrganization>{};
  hasUpdate: boolean = true;
  options: any = {};
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    const organizationId = this.activatedRoute.snapshot.params['organizationId'];
    this.options = this.activatedRoute.snapshot.data;
    this.data = await this.organizationService.GetOrganizationById(organizationId);
  }

  save(e: UpdateOrganization) {
    this.organizationService.UpdateOrganization(e);
  }

  cancel(e: UpdateOrganization) {
    let organizationId = this.activatedRoute.snapshot.params['organizationId'];
    this.organizationService
      .GetOrganizationById(organizationId)
      .then((res: OrganizationModel) => {
        this.data = res;
      });
  }

  onDeleteClick(e: UpdateOrganization) {
    let organizationId = this.activatedRoute.snapshot.params['organizationId'];
    this.organizationService.DeleteOrganization(organizationId).then((res: CommandResponse<string>) => {
      if (res.aggregatorId) {
        this.router.navigate(['tenanat/customers'], {
          relativeTo: this.activatedRoute,
        });
      }
    });
  }

  onPassiveClick(e: UpdateOrganization) {
    let organizationId = this.activatedRoute.snapshot.params['organizationId'];
    let request = <DisabledOrganization>{
      organizationId: organizationId,
      lock: true
    };
    this.organizationService.DisabledOrganization(request);
  }

  onReActiveClick(e: UpdateOrganization) {
    let organizationId = this.activatedRoute.snapshot.params['organizationId'];
    let request = <DisabledOrganization>{
      organizationId: organizationId,
      lock: false
    };
    this.organizationService.DisabledOrganization(request);
  }
}
