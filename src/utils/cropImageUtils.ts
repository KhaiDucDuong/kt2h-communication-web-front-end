  
  export function degreesToRadians(degreeValue: number) {
    return (degreeValue * Math.PI) / 180;
  }
  
  /**
   * Returns the new bounding area of a rotated rectangle.
   */
  export function rotateSize(width: number, height: number, rotation: number) {
    const rotRad = degreesToRadians(rotation);
  
    return {
      boxWidth:
        Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
      boxHeight:
        Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    };
  }