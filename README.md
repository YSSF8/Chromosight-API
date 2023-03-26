# Chromosight API

Chromosight API is a web API that allows you to extract the most dominant colors from an image, and get their corresponding RGB, HSL, and HEX values.

## Usage

To use the Chromosight API, simply make a `GET` request to the API endpoint with the image query parameter set to the URL of the `image` you want to extract colors from. Here's an example:

```
https://chromosight-api.darksidex37.repl.co/?image=https://example.com/image.jpg
```

This will return a JSON response containing the URL of the image, and an array of the most dominant colors in the image, along with their RGB, HSL, and HEX values.

### Example Response

```json
{
    "colors": [
        {
            "hex": "#00b39d",
            "hsl": [
                172.62569832402235,
                100,
                35.09803921568627
            ],
            "rgb": [
                0,
                179,
                157
            ]
        },
        {
            "hex": "#00be9c",
            "hsl": [
                169.26315789473682,
                100,
                37.254901960784316
            ],
            "rgb": [
                0,
                190,
                156
            ]
        },
        {
            "hex": "#01ba9b",
            "hsl": [
                169.94594594594594,
                98.93048128342247,
                36.666666666666664
            ],
            "rgb": [
                1,
                186,
                155
            ]
        },
        {
            "hex": "#00b89c",
            "hsl": [
                170.8695652173913,
                100,
                36.07843137254902
            ],
            "rgb": [
                0,
                184,
                156
            ]
        }
    ],
    "image": "https://img.freepik.com/free-vector/gradient-dynamic-lines-background_23-2149005728.jpg?w=826"
}
```

## Dependencies

* Flask
* Pillow

## Hosting

This API is currently hosted on replit.com. If you'd like to host anything you want.
