# WebGL Final Project

> **본 문서는 webGL의 가장 기초적인 부분인 Transform과 View에 대한 튜토리얼입니다.**

## Cube Basic

> 해당 Tab에서는 Cube의 Drawmode와 Transform에 대한 내용을 다룹니다.

```javascript
void gl.drawArray(mode, first, count);
```

### Parameters

#### mode

-   gl.POINTS(0): Draws a single dot.
-   gl.LINE_LOOP(2): Draws a straight line to the next vertex, and connects the last vertex back to the first.
-   gl.TRIANGLES(4): Draws a triangle for a group of three vertices.

각 mode마다 고유 숫자를 가지고 있기 때문에 직접 mode를 입력할 필요 없이 mode에 해당하는 숫자를 입력해도 해당 함수를 사용할 수 있습니다. 각 mode에 해당하는 숫자는 console창에서 gl.{mode}를 입력하여 확인할 수 있습니다.

### Examples

```javascript
gl.drawArrays(4, 0, 36); // 4는 gl.TRIANGLES에 해당하는 숫자입니다.
```

## LookAt

## Perspective

## References

-   https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawArrays
