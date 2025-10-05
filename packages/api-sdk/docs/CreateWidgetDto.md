# CreateWidgetDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**projectId** | **string** | The ID of the project this widget belongs to | [default to undefined]
**name** | **string** | The name of the widget | [default to undefined]
**type** | **string** | The type of the widget | [default to undefined]
**enabled** | **boolean** | Whether the widget is enabled | [default to false]
**config** | **object** | JSON configuration for the widget | [optional] [default to undefined]

## Example

```typescript
import { CreateWidgetDto } from './api';

const instance: CreateWidgetDto = {
    projectId,
    name,
    type,
    enabled,
    config,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
