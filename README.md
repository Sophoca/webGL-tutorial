# WebGL Final Project

> **본 문서는 webGL의 가장 기초적인 부분인 Transform과 View에 대한 튜토리얼입니다.**

# Cube Basic

> 해당 Tab에서는 Cube의 Drawmode와 Transform에 대한 내용을 다룹니다.

## Drawmode

```javascript
void gl.drawArray(mode, first, count);
```

-   gl.POINTS(0): Draws a single dot.
-   gl.LINE_LOOP(2): Draws a straight line to the next vertex, and connects the last vertex back to the first.
-   gl.TRIANGLES(4): Draws a triangle for a group of three vertices.

각 mode마다 고유 숫자를 가지고 있기 때문에 직접 mode를 입력할 필요 없이 mode에 해당하는 숫자를 입력해도 해당 함수를 사용할 수 있습니다.
각 mode에 해당하는 숫자는 console창에서 gl.{mode}를 입력하여 확인할 수 있습니다.

### Examples

```javascript
gl.drawArrays(4, 0, 36); // 4는 gl.TRIANGLES에 해당하는 숫자입니다.
```

<hr>

## Transform

> Linear Transform의 종류로는 Translation, Rotation, Scaling이 있습니다.

### Translation

```javascript
translate(out, a, v);
```

-   out: the receiving matrix
-   a: the matrix to translate
-   v: vector to translate by

#### Examples

```javascript
mat4.translate(mMat, mMat, [xMove, yMove, zMove]);
```

### Rotation

```javascript
rotate(out, a, rad, axis);
rotateX(out, a, rad); // axis=[1, 0, 0]
rotateY(out, a, rad); // axis=[0, 1, 0]
rotateZ(out, a, rad); // axis=[0, 0, 1]
```

-   out: the receiving matrix
-   a: the matrix to rotate
-   rad: the angle to rotate the matrix by
-   axis: the axis to rotate around

#### Examples

```javascript
mat4.rotateX(mMat, mMat, xRot);
mat4.rotateY(mMat, mMat, yRot);
mat4.rotateZ(mMat, mMat, zRot);
```

### Scaling

```javascript
scale(out, a, v);
```

-   out: the receiving matrix
-   a: the matrix to scale
-   v: the vec3 to scale the matrix by

#### Examples

```javascript
mat4.scale(mMat, mMat, [xScale, yScale, zScale]);
```

## LookAt

## Perspective

## References

-   https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawArrays
-   https://glmatrix.net/docs/module-mat4.html
