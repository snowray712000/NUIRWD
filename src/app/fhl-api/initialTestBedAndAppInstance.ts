import { TestBed, TestBedStatic } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient, HttpResponse } from '@angular/common/http';
import { Injector } from '@angular/core';
import { appInstance } from '../app.module';
import { Observable } from 'rxjs';
import { gTestingAbvResult } from './abv.service';

export interface ITestingToolHttpClient {
  testBed: TestBedStatic;
  httpClient: HttpClient;
}
/**
 * TestBed 當用在 HttpClient 相關的測試時，可以用這個初始化，回傳HttpClient可供 spyOn 去過載 get 之類的
 */
// tslint:disable-next-line: max-line-length
export function initialTestBedAndAppInstance(httpClientGetOverload: Observable<HttpResponse<string>> = undefined, isOverLoadGet = true): ITestingToolHttpClient {
  TestBed.configureTestingModule({
    imports: [BrowserModule, HttpClientModule],
    providers: [Injector, HttpClient]
  });
  appInstance.injector = TestBed.get(Injector);
  if (httpClientGetOverload === undefined) {
    httpClientGetOverload = gTestingAbvResult();
  }
  const http = TestBed.get(HttpClient);
  if (isOverLoadGet) {
    spyOn(http, 'get').and.returnValue(httpClientGetOverload);
  }
  return {
    testBed: TestBed,
    httpClient: http
  };
}
