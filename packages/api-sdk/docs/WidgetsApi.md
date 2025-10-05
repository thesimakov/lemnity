# WidgetsApi

All URIs are relative to *http://localhost:3000/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**widgetControllerCreate**](#widgetcontrollercreate) | **POST** /api/widgets | |
|[**widgetControllerFindAllByProject**](#widgetcontrollerfindallbyproject) | **GET** /api/widgets | |
|[**widgetControllerFindOne**](#widgetcontrollerfindone) | **GET** /api/widgets/{id} | |
|[**widgetControllerRemove**](#widgetcontrollerremove) | **DELETE** /api/widgets/{id} | |
|[**widgetControllerToggleEnabled**](#widgetcontrollertoggleenabled) | **PATCH** /api/widgets/{id}/toggle | |
|[**widgetControllerUpdate**](#widgetcontrollerupdate) | **PATCH** /api/widgets/{id} | |

# **widgetControllerCreate**
> Widget widgetControllerCreate(createWidgetDto)


### Example

```typescript
import {
    WidgetsApi,
    Configuration,
    CreateWidgetDto
} from './api';

const configuration = new Configuration();
const apiInstance = new WidgetsApi(configuration);

let createWidgetDto: CreateWidgetDto; //

const { status, data } = await apiInstance.widgetControllerCreate(
    createWidgetDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createWidgetDto** | **CreateWidgetDto**|  | |


### Return type

**Widget**

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

# **widgetControllerFindAllByProject**
> Array<Widget> widgetControllerFindAllByProject()


### Example

```typescript
import {
    WidgetsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WidgetsApi(configuration);

let projectId: string; // (default to undefined)

const { status, data } = await apiInstance.widgetControllerFindAllByProject(
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] |  | defaults to undefined|


### Return type

**Array<Widget>**

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

# **widgetControllerFindOne**
> Widget widgetControllerFindOne()


### Example

```typescript
import {
    WidgetsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WidgetsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.widgetControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**Widget**

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

# **widgetControllerRemove**
> Widget widgetControllerRemove()


### Example

```typescript
import {
    WidgetsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WidgetsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.widgetControllerRemove(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**Widget**

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

# **widgetControllerToggleEnabled**
> Widget widgetControllerToggleEnabled()


### Example

```typescript
import {
    WidgetsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WidgetsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.widgetControllerToggleEnabled(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**Widget**

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

# **widgetControllerUpdate**
> Widget widgetControllerUpdate(updateWidgetDto)


### Example

```typescript
import {
    WidgetsApi,
    Configuration,
    UpdateWidgetDto
} from './api';

const configuration = new Configuration();
const apiInstance = new WidgetsApi(configuration);

let id: string; // (default to undefined)
let updateWidgetDto: UpdateWidgetDto; //

const { status, data } = await apiInstance.widgetControllerUpdate(
    id,
    updateWidgetDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateWidgetDto** | **UpdateWidgetDto**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**Widget**

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

