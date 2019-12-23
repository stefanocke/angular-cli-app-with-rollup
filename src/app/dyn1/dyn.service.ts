import { Injectable } from '@angular/core';

@Injectable()
export class DynService {
    id = Math.floor(Math.random() * 100);
}