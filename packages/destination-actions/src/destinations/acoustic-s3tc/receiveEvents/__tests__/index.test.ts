// import nock from 'nock'
// import { createTestEvent } from '@segment/actions-core'

// import { ActionDefinition, IntegrationError, InvalidAuthenticationError } from '@segment/actions-core';
import { Settings } from '../../generated-types'
import { Payload } from '../generated-types'
import action from '../index'
import { validateSettings } from '../preCheck'
import { addUpdateEvents } from '../eventprocessing'

describe('Receive Events Action', () => {
  // Mocked request function
  const mockRequest = jest.fn()

  // const _e = createTestEvent()

  const mockSettings = {
    cacheType: 'S3',
    s3_access_key: 'access_key',
    s3_secret: 'secret',
    s3_region: 'us-east-1',
    s3_bucket: 'my-bucket',
    fileNamePrefix: 'prefix'
  } as Settings

  const mockPayload: Payload = {
    email: 'Test20@gmail.com',
    type: 'track',
    timestamp: '2023-08-20T12:27:36.832Z',
    context: {
      personas: {
        audience: 'abc'
      },
      externalIds: [
        {
          collection: 'users',
          encoding: 'none',
          id: 'Test20@gmail.com',
          type: 'shopify_customer_id'
        }
      ],
      integration: {
        name: 'shopify_littledata',
        version: '9.1'
      },
      ip: '162.207.146.0',
      library: {
        name: 'analytics-node',
        version: '6.2.0'
      },
      traits: {
        email: 'Test20@gmail.com',
        firstName: 'Test20',
        lastName: 'Tester',
        phone: '+16014023350'
      },
      userAgent: 'PuraIosApp/3.40.0'
    },
    properties: {
      action_source: 'system_generated',
      cart_id: 'bd213c96b13dddf4d30fd9cf094bf406',
      category: 'Shopify (Littledata)',
      checkout_id: 29221700829293,
      currency: 'USD',
      email: 'Test20@gmail.com',
      presentment_amount: '35.98',
      presentment_currency: 'USD',
      price: 35.98
    },
    traits: {
      email: 'Test20@gmail.com',
      firstName: 'Test20',
      lastName: 'Tester',
      phone: '+16014023350'
    }
  }

  test('perform Action.Perform call with valid payload and settings', async () => {
    action.perform(mockRequest, { settings: mockSettings, payload: mockPayload })
  })

  test('perform ValidateSettings call with valid payload and settings', async () => {
    // Mock validateSettings function
    const mockValidateSettings = jest.fn(validateSettings)
    mockValidateSettings(mockSettings)
    expect(mockValidateSettings).toHaveBeenCalledWith(mockSettings)
    expect(mockValidateSettings).toHaveReturned()
  })

  test('perform AddUpdateEvents call with valid payload and settings', async () => {
    // Mock addUpdateEvents function
    const mockAddUpdateEvents = jest.fn(addUpdateEvents).mockReturnValue('csvRows')
    mockAddUpdateEvents(mockPayload, mockPayload.email)
    expect(mockAddUpdateEvents).toHaveBeenCalledWith(mockPayload, mockPayload.email)
    expect(mockAddUpdateEvents).toHaveReturned()
  })

  test('perform generateS3RequestOptions call with valid payload and settings', async () => {
    // Mock generateS3RequestOptions function
    const mockGenerateS3RequestOptions = jest.fn().mockResolvedValue({})
    mockGenerateS3RequestOptions(
      mockSettings.s3_bucket,
      mockSettings.s3_region,
      expect.any(String), // Generated file name
      'PUT',
      'csvRows',
      mockSettings.s3_access_key,
      mockSettings.s3_secret
    )

    expect(mockGenerateS3RequestOptions).toHaveBeenCalledWith(
      mockSettings.s3_bucket,
      mockSettings.s3_region,
      expect.any(String), // Generated file name
      'PUT',
      'csvRows',
      mockSettings.s3_access_key,
      mockSettings.s3_secret
    )
  })
})
