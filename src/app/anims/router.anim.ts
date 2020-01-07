import {animate, group, state, style, transition, trigger} from "@angular/animations";


// 单个动画
// export const slideToRight = trigger('routeAnim', [
//     state('void', style({position: 'fixed', width: '100%', height: '80%'})),
//     state('*',  style({position: 'fixed', width: '100%', height: '80%'})),
//     transition('void => *', [  // 进场动画
//         style({transform: 'translateX(-100%)'}),
//         animate('.5s ease-in-out', style({transform: 'translateX(0)'}))
//     ]),
//     transition('* => void', [  // 离场动画
//         style({transform: 'translateX(0)'}),
//         animate('.5s ease-in-out', style({transform: 'translateX(100%)'}))
//     ])
// ]);


export const slideToRight = trigger('routeAnim', [
    state('void', style({position: 'fixed', width: '100%', height: '80%'})),
    state('*',  style({position: 'fixed', width: '100%', height: '80%'})),
    transition(':enter', [  // 进场动画
        style({transform: 'translateX(-100%)', opacity: 0}),
        group([
            animate('.5s ease-in-out', style({transform: 'translateX(0)'})),
            animate('.3s ease-in', style({opacity: 1}))
        ])
    ]),
    transition(':leave', [  // 离场动画
        style({transform: 'translateX(0)', opacity: 1}),
        group([
            animate('.5s ease-in-out', style({transform: 'translateX(100%)'})),
            animate('.3s ease-in', style({opacity: 0}))
        ])
    ])
]);
