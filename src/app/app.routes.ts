import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { DuplicateDetectorComponent } from './components/duplicate-detector/duplicate-detector.component';
import { FilterComponent } from './components/filter/filter.component';
import { SearchComponent } from './components/search/search.component';
import { QuestionListComponent } from './components/question-list/question-list.component';
import { UploadModalComponent } from './components/upload/upload.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { SignComponent } from './components/sign-in/sign-in.component';
import { LandingPageComponent } from './landingpage/landingpage.component';
import { FlaggedQuestionsComponent } from './components/flagged-questions/flagged-questions.component';

export const routes: Routes = [
    { path: 'user', component: UserDashboardComponent },
    { path: 'filter', component: FilterComponent },
    { path: 'search', component: SearchComponent },
    { path: 'admin', component: AdminDashboardComponent },
    { path: 'upload', component: UploadModalComponent },
    { path: 'duplicates', component: DuplicateDetectorComponent },
    { path: 'flagged-questions', component: FlaggedQuestionsComponent },
    { path: 'login', component: SignComponent },
    { path: '', component: LandingPageComponent }
];