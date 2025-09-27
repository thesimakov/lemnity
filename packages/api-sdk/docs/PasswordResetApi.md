# PasswordResetApi

All URIs are relative to *http://localhost:3000/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**passwordResetControllerForgotPassword**](#passwordresetcontrollerforgotpassword) | **POST** /api/auth/forgot-password | |
|[**passwordResetControllerResetPassword**](#passwordresetcontrollerresetpassword) | **POST** /api/auth/reset-password | |

# **passwordResetControllerForgotPassword**
> passwordResetControllerForgotPassword(forgotPasswordDto)


### Example

```typescript
import {
    PasswordResetApi,
    Configuration,
    ForgotPasswordDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PasswordResetApi(configuration);

let forgotPasswordDto: ForgotPasswordDto; //

const { status, data } = await apiInstance.passwordResetControllerForgotPassword(
    forgotPasswordDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **forgotPasswordDto** | **ForgotPasswordDto**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **passwordResetControllerResetPassword**
> passwordResetControllerResetPassword(resetPasswordDto)


### Example

```typescript
import {
    PasswordResetApi,
    Configuration,
    ResetPasswordDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PasswordResetApi(configuration);

let resetPasswordDto: ResetPasswordDto; //

const { status, data } = await apiInstance.passwordResetControllerResetPassword(
    resetPasswordDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **resetPasswordDto** | **ResetPasswordDto**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

