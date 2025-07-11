import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { QuillModule } from "ngx-quill";
import { QuillConfiguration } from "./quill-configuration";
import TurndownService from 'turndown';
import { marked } from 'marked';

@Component({
  selector: "rich-text-editor",
  standalone: true,
  templateUrl: "./rich-text-editor.component.html",
  styleUrls: ["./rich-text-editor.component.scss"],
  imports: [CommonModule, QuillModule, ReactiveFormsModule],
})
export class RichTextEditorComponent implements OnInit {
  @Input() control!: FormControl;
  htmlControl = new FormControl('');
  quillConfiguration = QuillConfiguration;

  private turndownService = new TurndownService({ headingStyle: 'atx' });

  async ngOnInit() {
    if (!this.control) this.control = new FormControl('');
    const markdown = this.control.value || '';    

    const html = await marked.parse(markdown);
    this.htmlControl.setValue(html);

    // Sync back markdown when HTML changes
    this.htmlControl.valueChanges.subscribe(html => {
      const markdown = this.turndownService.turndown(html || '');
      this.control.setValue(markdown, { emitEvent: false });
      console.log(markdown);
      
    });
  }

  onContentChanged(event: any) {
  }
}
