export { MyCommonModule } from "../app/common/common.module";
export { MyCommonModuleNgFactory } from "../app/common/common.module.ngfactory";
export { CommonComponent } from '../app/common/common.component';

//TODO: Does not work in ts at the moment; will be empty. 
//Hopefully can be removed at all with Ivy
export * from '../app/common/common.component.ngfactory';
