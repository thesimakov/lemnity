# Widget


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | The unique identifier of the widget | [default to undefined]
**projectId** | **string** | The ID of the project this widget belongs to | [default to undefined]
**name** | **string** | The name of the widget | [default to undefined]
**type** | **string** | The type of the widget | [default to undefined]
**enabled** | **boolean** | Whether the widget is enabled | [default to undefined]
**config** | **object** | JSON configuration for the widget | [optional] [default to undefined]
**configVersion** | **object** | Version of the widget configuration | [optional] [default to undefined]
**createdAt** | **string** | Creation timestamp | [default to undefined]
**updatedAt** | **string** | Last update timestamp | [default to undefined]

## Example

```typescript
import { Widget } from './api';

const instance: Widget = {
    id,
    projectId,
    name,
    type,
    enabled,
    config,
    configVersion,
    createdAt,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
