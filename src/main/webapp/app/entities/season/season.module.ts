import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SeasonComponent } from './list/season.component';
import { SeasonDetailComponent } from './detail/season-detail.component';
import { SeasonUpdateComponent } from './update/season-update.component';
import { SeasonDeleteDialogComponent } from './delete/season-delete-dialog.component';
import { SeasonRoutingModule } from './route/season-routing.module';

@NgModule({
  imports: [SharedModule, SeasonRoutingModule],
  declarations: [SeasonComponent, SeasonDetailComponent, SeasonUpdateComponent, SeasonDeleteDialogComponent],
  entryComponents: [SeasonDeleteDialogComponent],
})
export class SeasonModule {}
