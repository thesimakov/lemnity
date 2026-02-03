# PublicWidgetsApi

All URIs are relative to *http://localhost:3000/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**publicWidgetControllerFindOne**](#publicwidgetcontrollerfindone) | **GET** /api/public/widgets/{id} | |
|[**publicWidgetControllerSpin**](#publicwidgetcontrollerspin) | **POST** /api/public/widgets/{id}/spin | |

# **publicWidgetControllerFindOne**
> PublicWidget publicWidgetControllerFindOne()


### Example

```typescript
import {
    PublicWidgetsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PublicWidgetsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.publicWidgetControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**PublicWidget**

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

# **publicWidgetControllerSpin**
> publicWidgetControllerSpin()


### Example

```typescript
import {
    PublicWidgetsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PublicWidgetsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.publicWidgetControllerSpin(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

