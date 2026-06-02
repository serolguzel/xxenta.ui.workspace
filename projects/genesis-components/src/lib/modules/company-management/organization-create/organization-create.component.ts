import { Component, OnInit } from '@angular/core';
import { BreadcrumbsModel, GenesisBreadcrumbsComponent } from 'genesis-shell';
import { OrganizationFormComponent } from '../components/organization-form/organization-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationService } from '../services/organization.service';
import { UpdateOrganization } from '../company.models';
import { CommandResponse } from 'genesis-coreservice';
import { NgClass } from '@angular/common';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-organization-create',
  templateUrl: './organization-create.component.html',
  standalone: true,
  imports: [
    NgClass,
    GenesisBreadcrumbsComponent,
    OrganizationFormComponent
  ],
  providers: [
    OrganizationService
  ]
})
export class OrganizationCreateComponent implements OnInit {
  breadcrumbs: Array<BreadcrumbsModel> = [];
  data: UpdateOrganization = <UpdateOrganization>{
    countryId: 'TR'
  };
  hasCreate: boolean = true;
  options: any = {};
  constructor(
    private organizationService: OrganizationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private readonly translocoService: TranslocoService
  ) {

  }
  ngOnInit(): void {
    this.breadcrumbs = [
      {
        title: this.translocoService.translate('labels.back'),
        link: this.activatedRoute.snapshot.data['backRoute']
      },
      {
        title: this.translocoService.translate(this.activatedRoute.snapshot.data['pageTitle'])
      }
    ];
    this.options = this.activatedRoute.snapshot.data;
    var organizationType = this.options.organizationType;
    if (organizationType)
      this.data.organizationTypes = [organizationType];
    if (this.options.organizationId)
      this.data.parentId = this.options.organizationId;
  }

  save(e: UpdateOrganization) {
    this.organizationService.CreateOrganization(e).then((res: CommandResponse<string>) => {
      if (res) {
        this.router.navigate([`detail/${res.aggregatorId}`], { relativeTo: this.activatedRoute });
      }
    });
  }
}
