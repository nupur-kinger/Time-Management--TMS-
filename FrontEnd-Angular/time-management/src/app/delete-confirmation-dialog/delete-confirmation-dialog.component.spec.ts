import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog.component';

describe('DeleteConfirmationDialogComponent', () => {
  let component: DeleteConfirmationDialogComponent;
  let fixture: ComponentFixture<DeleteConfirmationDialogComponent>;

  beforeEach(async(() => {
    it('should create', () => {
      let data = "Delete Task";
      let component: DeleteConfirmationDialogComponent = new DeleteConfirmationDialogComponent(data);
      expect(component).toBeTruthy();
    });
  }));

});
