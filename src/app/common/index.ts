export { MyCommonModule } from './common.module';

//The component types provided by the module must also be exported, since Ivy creates
//references to them in the ngComponentDefs of using components.
export { CommonComponent } from './common.component';

//Here could be other exports, for instance services.