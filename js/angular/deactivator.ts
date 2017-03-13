# deactivator.ts
import { Injectable, Component } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate } from "@angular/router";
import { BucketStorageService } from "../../../components/storage/storage.bucket.service";
import { Observable, Subscription, Observer, Subscriber } from "rxjs";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalComponent } from "./resource-control.interfaces";
import { NotificationService } from "../../../core/notification/notification.service";
import set = Reflect.set;


@Component( {
  selector: "deactivate-modal",
  templateUrl: "./resource-control.deactivator.html"
} )
export class DeactivateConfirmModalComponent {
  constructor ( public activeModal: NgbActiveModal, ) {
  }
}

@Injectable()
export class Deactivator implements CanDeactivate<any> {
  private newval: boolean;

  constructor ( public notificationService: NotificationService,
                private bucketStorageService: BucketStorageService ) {
  }

  /* todo: nextState?: RouterStateSnapshot is used into ^4.0.0, remove this.notificationService.allowInboxActivator */
  canDeactivate ( component: ModalComponent,
                  route: ActivatedRouteSnapshot,
                  state: RouterStateSnapshot,
                  nextState?: RouterStateSnapshot ): Observable<boolean>|Promise<boolean>|boolean {

    if ( !(this.bucketStorageService.isEmpty()) ) {
      return Observable.create( ( observer: Subscriber<any> ) => {
        let that = this;
        let val = this.notificationService.allowInboxActivator.do( ( next ) => {
          this.newval = next;
        } );
        let subs = val.subscribe();
        return new Promise( () => {
          setTimeout( () => {
            if ( !that.newval ) {
              // if not approval
              component.ngbModal.open( DeactivateConfirmModalComponent ).result.then( () => {
                // if press cancel
                subs.unsubscribe();
                that.notificationService.allowInboxActivator.next( false );
                observer.next( that.newval )
              }, () => {
                // if press delete
                subs.unsubscribe();
                this.bucketStorageService.setStoreIds([]);
                observer.next( true );
                that.notificationService.allowInboxActivator.next( false );
              } );
            }
            else {
              // if approval
              subs.unsubscribe();
              that.notificationService.allowInboxActivator.next( false );
              observer.next( true )
            }
          }, 300 )
        } );
      } ).delay( 200 );
    }

    else {
      return true;
    }
  }
}

# router.ts
const resourceControlRoutes: Routes = [
    {
        path: '',
        component: ResourceReportTabsComponent,
        children: [
            {path: '', redirectTo: 'ace', pathMatch: 'full', },
            {path: 'ace', component: AceControlComponent,  canDeactivate: [Deactivator]},
        ],
    },
];

# allowRouter.ts
@Injectable()
export class AllowStoreActivate implements CanActivate {
  constructor(public notificationService: NotificationService){}

  canActivate ( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<boolean>|Promise<boolean>|boolean {
    this.notificationService.allowInboxActivator.next(true);
    return true;
  }
}
const routes: Routes = [
  {
    path: 'approval',
    component: ApprovalComponent,
    canActivate: [ AllowStoreActivate ]
  }
];
@NgModule( {
  imports: [
    RouterModule.forChild( routes )
  ],
  exports: [
    RouterModule
  ]
} )
export class ApprovalRoutingModule {
}

