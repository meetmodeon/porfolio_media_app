import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, effect, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { MyDetailsServiceService } from '../../../../service/myDetails/my-details-service.service';
import { Observable } from 'rxjs';

interface dasboardDataInterface{
  newUserCount:number|string,
  oldUserCount:number|string,
  totalNoOfBlogs:number|string,
  totalNoOfProject:number|string
}

@Component({
  selector: 'app-chart-component',
  imports: [
  ChartModule,
  ],
  templateUrl: './chart-component.component.html',
  styleUrl: './chart-component.component.scss'
})
export class ChartComponentComponent {
  basicData: any;
  getCount:any;
  postCount:any;
  deleteCount:any;
  putCount:any;
   data: any;
  options: any;



  dashboadData:dasboardDataInterface={
    newUserCount:0,
    oldUserCount:0,
    totalNoOfBlogs:0,
    totalNoOfProject:0
  }

    basicOptions: any;

    platformId = inject(PLATFORM_ID);


    constructor(private cd: ChangeDetectorRef,
      private myDetailsService:MyDetailsServiceService
    ) {}

    ngOnInit() {
        this.initChart();
        this.getDashboardStat();
        this.getCountOfGet();
        this.getCountOfDelete();
        this.getCountOfPost();
        this.getCountOfPut();
    }
    getDashboardStat(){
      this.myDetailsService.getDashboardStat().subscribe({
        next:(value:dasboardDataInterface)=>{
          this.dashboadData=value;
          console.log(this.dashboadData);
          this.initChart();
        }
      })
    }
    getCountOfGet(){
      this.myDetailsService.getCountOfGet().subscribe({
        next:(value:any)=>{
          const listofData=value.measurements;
          for(let data of listofData){
            if(data.statistic==='COUNT'){
              this.getCount=data.value;
            }
          }
          console.log("This get vlaue of :: "+this.getCount);
        }
      })
    }
     getCountOfPost(){
      this.myDetailsService.getCountOfPost().subscribe({
        next:(value:any)=>{
          const listofData=value.measurements;
          for(let data of listofData){
            if(data.statistic==='COUNT'){
              this.postCount=data.value;
            }
          }

        }
      })
    }

     getCountOfDelete(){
      this.myDetailsService.getCountOfDelete().subscribe({
        next:(value:any)=>{
          const listofData=value.measurements;
          for(let data of listofData){
            if(data.statistic==='COUNT'){
              this.deleteCount=data.value;
            }
          }
         
        }
      })
    }

     getCountOfPut(){
      this.myDetailsService.getCountOfPut().subscribe({
        next:(value:any)=>{
          const listofData=value.measurements;
          for(let data of listofData){
            if(data.statistic==='COUNT'){
              this.putCount=data.value;
            }
          }
        }
      })
    }




    initChart() {
        if (isPlatformBrowser(this.platformId)) {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--p-text-color');
            const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
            const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

            this.basicData = {
                labels: ['New User', 'OldUser', 'Project', 'Blogs'],
                datasets: [
                    {
                        label: 'Details',
                        data: [this.dashboadData.newUserCount, this.dashboadData.oldUserCount, this.dashboadData.totalNoOfProject, this.dashboadData.totalNoOfBlogs],
                        backgroundColor: [
                            'rgba(249, 115, 22, 0.2)',
                            'rgba(6, 182, 212, 0.2)',
                            'rgb(107, 114, 128, 0.2)',
                            'rgba(139, 92, 246, 0.2)',
                        ],
                        borderColor: ['rgb(249, 115, 22)', 'rgb(6, 182, 212)', 'rgb(107, 114, 128)', 'rgb(139, 92, 246)'],
                        borderWidth: 1,
                    },
                ],
            };

            this.basicOptions = {
                plugins: {
                    legend: {
                        labels: {
                            color: textColor,
                        },
                    },
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary,
                        },
                        grid: {
                            color: surfaceBorder,
                        },
                    },
                    y: {
                        beginAtZero: true,
                        suggestedMax:Math.max(
                          +this.dashboadData.newUserCount,
                          +this.dashboadData.oldUserCount,
                          +this.dashboadData.totalNoOfProject,
                          +this.dashboadData.totalNoOfBlogs
                        )+5,
                        ticks: {
                          stepSize:1,
                            color: textColorSecondary,
                        },
                        grid: {
                            color: surfaceBorder,
                        },
                    },
                },
            };
            
            this.data = {
                labels: ['GET', 'POST', 'PUT','DELETE'],
                datasets: [
                    {
                        data: [this.getCount, this.postCount, this.putCount,this.deleteCount],
                        backgroundColor: [documentStyle.getPropertyValue('--p-cyan-500'), documentStyle.getPropertyValue('--p-orange-500'), documentStyle.getPropertyValue('--p-gray-500'),documentStyle.getPropertyValue('--p-red-500')],
                        hoverBackgroundColor: [documentStyle.getPropertyValue('--p-cyan-400'), documentStyle.getPropertyValue('--p-orange-400'), documentStyle.getPropertyValue('--p-gray-400'),documentStyle.getPropertyValue('--p-red-400')]
                    }
                ]
            };

            this.options = {
                cutout: '60%',
                plugins: {
                    legend: {
                        labels: {
                            color: textColor
                        }
                    }
                }
            };
            this.cd.markForCheck()
        }
    }
   
   
    
}
