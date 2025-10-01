# ProjectApi

All URIs are relative to *http://localhost:3000/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**projectControllerCreate**](#projectcontrollercreate) | **POST** /api/projects | |
|[**projectControllerFindAll**](#projectcontrollerfindall) | **GET** /api/projects | |
|[**projectControllerFindOne**](#projectcontrollerfindone) | **GET** /api/projects/{id} | |
|[**projectControllerRemove**](#projectcontrollerremove) | **DELETE** /api/projects/{id} | |
|[**projectControllerUpdate**](#projectcontrollerupdate) | **PATCH** /api/projects/{id} | |

# **projectControllerCreate**
> CreateProjectResponse projectControllerCreate(createProjectDto)


### Example

```typescript
import {
    ProjectApi,
    Configuration,
    CreateProjectDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectApi(configuration);

let createProjectDto: CreateProjectDto; //

const { status, data } = await apiInstance.projectControllerCreate(
    createProjectDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createProjectDto** | **CreateProjectDto**|  | |


### Return type

**CreateProjectResponse**

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

# **projectControllerFindAll**
> ProjectsResponse projectControllerFindAll()


### Example

```typescript
import {
    ProjectApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectApi(configuration);

const { status, data } = await apiInstance.projectControllerFindAll();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ProjectsResponse**

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

# **projectControllerFindOne**
> GetProjectResponse projectControllerFindOne()


### Example

```typescript
import {
    ProjectApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.projectControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**GetProjectResponse**

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

# **projectControllerRemove**
> DeleteProjectResponse projectControllerRemove()


### Example

```typescript
import {
    ProjectApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.projectControllerRemove(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**DeleteProjectResponse**

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

# **projectControllerUpdate**
> UpdateProjectResponse projectControllerUpdate(updateProjectDto)


### Example

```typescript
import {
    ProjectApi,
    Configuration,
    UpdateProjectDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectApi(configuration);

let id: string; // (default to undefined)
let updateProjectDto: UpdateProjectDto; //

const { status, data } = await apiInstance.projectControllerUpdate(
    id,
    updateProjectDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateProjectDto** | **UpdateProjectDto**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**UpdateProjectResponse**

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

