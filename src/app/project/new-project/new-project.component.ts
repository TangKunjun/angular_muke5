import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {OverlayContainer} from '@angular/cdk/overlay';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewProjectComponent implements OnInit {

  coverImages = [];
  title = '';
  form: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogRef: MatDialogRef<NewProjectComponent>,
    private fb: FormBuilder,
    private oc: OverlayContainer
    ) { }

  ngOnInit() {
    this.coverImages = this.data.thumbnails;
    if (this.data.project) {
        this.form = this.fb.group({
            name: [this.data.project.name, Validators.required],
            desc: [this.data.project.desc],
            coverImg: [this.data.project.coverImg]
        });
    } else {
        this.form = this.fb.group({
            name: ['', Validators.required],
            desc: [],
            coverImg: [this.data.img]
        });
    }
    this.title = this.data.title;
  }
  onSubmit({value, valid}, event) {
    if (!valid) {return ; }
    if (this.data.project && this.data.project.id) {
        this.dialogRef.close({...value, id: this.data.project.id});
    } else {
        this.dialogRef.close(value);
    }
  }

}
