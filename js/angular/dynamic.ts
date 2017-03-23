// approval.component.html
// <div #dynamicComponentContainer></div>

// js
@Component({
    selector: 'rsafe-approval',
    templateUrl: 'approval.component.html',
    styleUrls: ['../../../../components/approval/approval.component.scss'],
    entryComponents: [ApprovalContentComponent, ApprovalComponentEmpty]

})
export class ApprovalComponentNTFS extends ApprovalComponent {
    name: string = 'Согласование';
    currentComponent = null;
    @ViewChild('dynamicComponentContainer', {read: ViewContainerRef}) approvalContentComponent: ViewContainerRef;

    constructor(private resolver: ComponentFactoryResolver,
                resourceState: ResourceState,
                private bucketStorage: StorageStaffService) {
        super(resourceState);
    }

    initPageName() {
        this._pageName.next(this.name);
    }

    ngOnInit() {
        if (this.bucketStorage.storedId.length > ApprovalContentComponent.MAX) {
            this.setComponent(ApprovalComponentEmpty);
            return;
        }
        this.setComponent(ApprovalContentComponent);
        let contentType = this.bucketStorage.staffReportContentType;
        this.currentComponent.instance.configureComponent(
            ServiceContentTypeMapper[contentType], nodeContentTypeMapper[contentType]);
        super.ngOnInit();
    }

    setComponent(componentMock) {
        let inputProviders = [{provide: componentMock, useClass: componentMock}];
        let resolvedInputs = ReflectiveInjector.resolve(inputProviders);

        // We create an injector out of the data we want to pass down and this components injector
        let injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.approvalContentComponent.parentInjector);

        // We create a factory out of the component we want to create
        let factory = this.resolver.resolveComponentFactory(componentMock);

        // We create the component using the factory and the injector
        let component = factory.create(injector);

        // We insert the component into the dom container
        this.approvalContentComponent.insert(component.hostView);

        // We can destroy the old component is we like by calling destroy
        if (this.currentComponent) {
            this.currentComponent.destroy();
        }
        this.currentComponent = component;
    }
}
