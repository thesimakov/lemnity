# RequestsApi

All URIs are relative to *http://localhost:3000/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**requestControllerFindAll**](#requestcontrollerfindall) | **GET** /api/requests | |
|[**requestControllerRemove**](#requestcontrollerremove) | **DELETE** /api/requests/{id} | |
|[**requestControllerUpdate**](#requestcontrollerupdate) | **PATCH** /api/requests/{id} | |

# **requestControllerFindAll**
> RequestsResponse requestControllerFindAll()


### Example

```typescript
import {
    RequestsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RequestsApi(configuration);

let projectId: string; // (optional) (default to undefined)
let period: '7d' | '30d' | '90d' | 'all'; // (optional) (default to '30d')
let status: 'new' | 'processed' | 'not_processed' | 'used'; // (optional) (default to undefined)
let skip: number; // (optional) (default to 0)
let take: number; // (optional) (default to 50)

const { status, data } = await apiInstance.requestControllerFindAll(
    projectId,
    period,
    status,
    skip,
    take
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] |  | (optional) defaults to undefined|
| **period** | [**&#39;7d&#39; | &#39;30d&#39; | &#39;90d&#39; | &#39;all&#39;**]**Array<&#39;7d&#39; &#124; &#39;30d&#39; &#124; &#39;90d&#39; &#124; &#39;all&#39;>** |  | (optional) defaults to '30d'|
| **status** | [**&#39;new&#39; | &#39;processed&#39; | &#39;not_processed&#39; | &#39;used&#39;**]**Array<&#39;new&#39; &#124; &#39;processed&#39; &#124; &#39;not_processed&#39; &#124; &#39;used&#39;>** |  | (optional) defaults to undefined|
| **skip** | [**number**] |  | (optional) defaults to 0|
| **take** | [**number**] |  | (optional) defaults to 50|


### Return type

**RequestsResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **requestControllerRemove**
> DeleteRequestResponse requestControllerRemove()


### Example

```typescript
import {
    RequestsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RequestsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.requestControllerRemove(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**DeleteRequestResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **requestControllerUpdate**
> RequestEntity requestControllerUpdate(updateRequestDto)


### Example

```typescript
import {
    RequestsApi,
    Configuration,
    UpdateRequestDto
} from './api';

const configuration = new Configuration();
const apiInstance = new RequestsApi(configuration);

let id: string; // (default to undefined)
let updateRequestDto: UpdateRequestDto; //

const { status, data } = await apiInstance.requestControllerUpdate(
    id,
    updateRequestDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateRequestDto** | **UpdateRequestDto**|  | |
| **id** | [**string**] |  | defaults to undefined|


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
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

