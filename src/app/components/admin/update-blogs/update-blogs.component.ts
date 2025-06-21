import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { BlogsServiceService } from '../../../service/blogs/blogs-service.service';
import { BlogsResponse } from '../../../modules/blogs-response';
import { MessageService } from 'primeng/api';
import {
  ActivatedRoute,
  RouterModule,
  RouterLink,
  Router,
} from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-update-blogs',
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ChipModule,
    ButtonModule,
    InputTextModule,
    AvatarModule,
    ToastModule,
    ConfirmPopupModule,
    ReactiveFormsModule,
    CommonModule,
    TooltipModule,
  ],
  providers: [MessageService],
  templateUrl: './update-blogs.component.html',
  styleUrl: './update-blogs.component.scss',
})
export class UpdateBlogsComponent {
  blogForm!: FormGroup;
  blogsData!: BlogsResponse;
  blogId!: any;
  loading = signal<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private blogService: BlogsServiceService,
    private messageService: MessageService,
    private routeRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.blogId = this.routeRoute.snapshot.paramMap.get('id');
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      tags: this.fb.array([this.fb.control('')]),
    });

    this.getBlogById();
  }

  get tags() {
    return this.blogForm.get('tags') as FormArray;
  }
  addTags() {
    this.tags.push(this.fb.control(''));
  }
  removeTags(index: any): boolean {
    this.tags.removeAt(index);
    return true;
  }
  getBlogById() {
    this.blogService.getBlogById(this.blogId).subscribe({
      next: (value: BlogsResponse) => {
        this.blogsData = value;
        this.blogForm.patchValue({
          title: this.blogsData.title,
          description: this.blogsData.description,
        });
        this.tags.clear();
        for (let tag of this.blogsData.tags) {
          this.tags.push(this.fb.control(tag));
        }
      },
      error: (error: any) => {
        console.log('Something went worng on fetching blog by its id');
      },
    });
  }
  onUpdate() {
    this.loading.set(true);
    this.blogService
      .updatesBlogs(this.blogId, this.blogForm.value)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data: BlogsResponse) => {
          this.blogsData = data;

          this.messageService.add({
            severity: 'info',
            summary: 'Updated',
            detail: 'Blogs updated successfully with id:: ' + this.blogId,
            life: 3000,
          });
          setTimeout(()=>{
            this.router.navigateByUrl('/admin/dashboard');
          },2000)
        },
      });
  }
}
