# PublicRequestsApi

All URIs are relative to *http://localhost:3000/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**publicRequestControllerCreate**](#publicrequestcontrollercreate) | **POST** /api/public/requests | |

# **publicRequestControllerCreate**
> RequestEntity publicRequestControllerCreate(createPublicRequestDto)


### Example

```typescript
import {
    PublicRequestsApi,
    Configuration,
    CreatePublicRequestDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PublicRequestsApi(configuration);

let createPublicRequestDto: CreatePublicRequestDto; //

const { status, data } = await apiInstance.publicRequestControllerCreate(
    createPublicRequestDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createPublicRequestDto** | **CreatePublicRequestDto**|  | |


### Return type

**RequestEntity**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

