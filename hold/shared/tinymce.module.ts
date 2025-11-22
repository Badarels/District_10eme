import { NgModule } from '@angular/core';
import { EditorModule } from '@tinymce/tinymce-angular';

@NgModule({
  imports: [EditorModule],
  exports: [EditorModule]
})
export class TinyMCEModule { } 