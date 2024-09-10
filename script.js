// https://webgpureport.org/
async function getWebGPUInfo() {
    const infoSection = document.getElementById("gpuInfo");
    infoSection.innerHTML = ''; // Clear previous content
  
    // Check if WebGPU is supported in the browser
    if (!navigator.gpu) {
      infoSection.innerHTML = "<p>WebGPU is not supported in this browser.</p>";
      return;
    }
  
    try {
      // Request an adapter (representing a physical GPU device)
      const adapter = await navigator.gpu.requestAdapter();
  
      if (!adapter) {
        infoSection.innerHTML = "<p>No suitable GPU adapter found.</p>";
        return;
      }

      const adapterInfo = await adapter.requestAdapterInfo();
  
      // Collect adapter information
      const adapterInfoView = `
        <p><strong>Adapter Information:</strong></p>        
        <pre>Name: ${adapterInfo.architecture}</pre>
        <pre>Vendor ID: ${adapterInfo.vendor}</pre>
        <pre>Device ID: ${adapterInfo.device}</pre>
        <pre>Description: ${adapterInfo.description}</pre>
      `;
  
      // Request a device from the adapter
      const device = await adapter.requestDevice();      
  
      // Collect supported features
      let features = "";
      adapter.features.forEach((feature) => {
        features += `<li>${feature}</li>`;
      });
  
      const featuresInfo = `
        <p><strong>Supported Features:</strong></p>
        <ul>${features}</ul>
      `;
  
      // Collect device limits
      let limits = "";
      const deviceLimits = device.limits;  
      const limitsProps = ["maxTextureDimension1D",
        "maxTextureDimension2D",
        "maxTextureDimension3D",
        "maxTextureArrayLayers",
        "maxBindGroups",
        "maxBindingsPerBindGroup",
        "maxDynamicUniformBuffersPerPipelineLayout",
        "maxDynamicStorageBuffersPerPipelineLayout",
        "maxSampledTexturesPerShaderStage",
        "maxSamplersPerShaderStage",
        "maxStorageBuffersPerShaderStage",
        "maxStorageTexturesPerShaderStage",
        "maxUniformBuffersPerShaderStage",
        "maxUniformBufferBindingSize",
        "maxStorageBufferBindingSize",
        "minUniformBufferOffsetAlignment",
        "minStorageBufferOffsetAlignment",
        "maxVertexBuffers",
        "maxBufferSize",
        "maxVertexAttributes",
        "maxVertexBufferArrayStride",
        "maxInterStageShaderComponents",
        "maxInterStageShaderVariables",
        "maxColorAttachments",
        "maxColorAttachmentBytesPerSample",
        "maxComputeWorkgroupStorageSize",
        "maxComputeInvocationsPerWorkgroup",
        "maxComputeWorkgroupSizeX",
        "maxComputeWorkgroupSizeY",
        "maxComputeWorkgroupSizeZ",
        "maxComputeWorkgroupsPerDimension"];      
      
      for (let item of limitsProps) {        
        limits += `<li>${item}: ${deviceLimits[item]}</li>`;
      }      
      const limitsInfo = `
        <p><strong>Device Limits:</strong></p>
        <ul>${limits}</ul>
      `;
  
      // Display all information
      infoSection.innerHTML = adapterInfoView + featuresInfo + limitsInfo;
    } catch (error) {
      infoSection.innerHTML = `<p>Error while querying WebGPU info: ${error.message}</p>`;
    }
  }
  
  // Attach event listener to the button
  document.getElementById("fetchInfoBtn").addEventListener("click", getWebGPUInfo);