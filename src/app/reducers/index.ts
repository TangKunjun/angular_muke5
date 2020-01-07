import {NgModule} from "@angular/core";
import {ActionReducer, combineReducers, StoreModule} from "@ngrx/store";
import {StoreRouterConnectingModule} from "@ngrx/router-store";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";

import * as fromQuote from "./quote.resucer";
import {compose} from "@ngrx/core";
import {storeFreeze} from "ngrx-store-freeze";
import {environment} from "../../environments/environment";
import {createSelector} from "reselect";

export interface State {  // 全局的
    quote: fromQuote.State;
}

const initialState: State = { // 全局的初始值
    quote: fromQuote.initialState
}

const reducers = {  // reducer字典 把所有的reduce放进去
    quote: fromQuote.reducer
}

// 合并所有的reducer
const productionReducers: ActionReducer<State> = combineReducers(reducers); // 生产环境
const developmentReducers: ActionReducer<State> = compose(storeFreeze, combineReducers)(reducers); // 开发环境  compose的用法等于 combineReducers(storeFreeze(reducers))

export function reducer(state = initialState, action: any): State { // 全局的
    return environment.production ?  productionReducers(state, action) : developmentReducers(state, action);
}

export const getQuoteState = (state: State) => {
    return state.quote;
}

// createSelector这个方法的作用和compose 有点像第一个参数结果的值作为第二个参数的参数
export const getQuote = createSelector(getQuoteState, fromQuote.getQuote);

@NgModule({
    imports: [
        StoreModule.forRoot({reducer}),
        StoreRouterConnectingModule.forRoot(),     // 路由store
        StoreDevtoolsModule.instrument()  // 开发者工具调试
    ]
})

export class AppStoreModule {
    
}