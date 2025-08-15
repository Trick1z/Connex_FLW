import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthRoute, ViewsRoute, GamesRoute} from 'src/app/Constants/routes.const';
import { WordScoringComponent } from './word-scoring/word-scoring.component';


const routes: Routes = [

    {
        path: GamesRoute.Word ,
        component: WordScoringComponent}

]


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GamesRoutingModule { }
