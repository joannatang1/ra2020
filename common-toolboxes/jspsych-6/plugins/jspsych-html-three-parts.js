/*
 * jspsych-same-different
 * Josh de Leeuw
 *
 * plugin for showing two stimuli sequentially and getting a same / different judgment
 *
 * documentation: docs.jspsych.org
 *
 */

jsPsych.plugins['html-three-parts'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'html-three-parts',
    description: '',
    parameters: {
      stimuli: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimuli',
        default: undefined,
        array: true,
        description: 'The HTML content to be displayed.'
      },
      response: {
        type: jsPsych.plugins.parameterType.SELECT,
        pretty_name: 'Response',
        default: 32,
        description: 'Space bar.'
      },
      first_stim_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'First stimulus duration',
        default: 200,
        description: 'How long to show the first stimulus for in milliseconds.'
      },
      second_stim_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Second stimulus duration',
        default: 200,
        description: 'How long to show a blank screen in between the two stimuli.'
      },
      flash_stim_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Flash stimulus duration',
        default: null,
        description: 'How long to show the flash stimulus for in milliseconds.'
      },
      third_stim_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Second stimulus duration',
        default: null,
        description: 'How long to show a blank screen in between the two stimuli.'
      },
      gap_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Third stimulus duration',
        default: null,
        description: 'How long to show the second stimulus for in milliseconds.'
      },
      delay: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Delay',
        default: 0,
        description: 'How long to show first stimulus between second and third stimulus.',
      },      
      delay2: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Delay2',
        default: null,
        description: 'How long to show first stimulus between flash and third stimulus.',
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      escape_key: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Escape key',
        default: 27,
        description: 'The key to press if wish to exit early and save data.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {

    //display_element.innerHTML = '<div class="jspsych-html-three-parts-stimulus">'+trial.stimuli[0]+'</div>';
    showFirstStim();

    var first_stim_info;
    if (trial.first_stim_duration > 0) {
      jsPsych.pluginAPI.setTimeout(function(info) {
        showSecondStim();
        first_stim_info = info;
      }, trial.first_stim_duration);
    } else {
      function afterKeyboardResponse(info) {
        first_stim_info = info;
        showBlankScreen();
      }
      jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: afterKeyboardResponse,
        valid_responses: trial.advance_key,
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });
    }

    function showBlankScreen() {
      display_element.innerHTML = '';

      jsPsych.pluginAPI.setTimeout(function() {
        showSecondStim();
      }, trial.gap_duration);
    }

    function showFlashStim() {
      display_element.innerHTML = '<div class="jspsych-html-three-parts-stimulus">'+trial.stimuli[3]+'</div>';

      jsPsych.pluginAPI.setTimeout(function() {
        showFirstStim();
      }, trial.flash_stim_duration);

    }

    function showFirstStim() {
      display_element.innerHTML = '<div class="jspsych-html-three-parts-stimulus">'+trial.stimuli[0]+'</div>';
    }

    function showSecondStim() {
      display_element.innerHTML = '<div class="jspsych-html-three-parts-stimulus">'+trial.stimuli[1]+'</div>';
      
      if(trial.delay > 0 && trial.flash_stim_duration > 0){
        jsPsych.pluginAPI.setTimeout(function() {
          showFirstStim();
        }, trial.second_stim_duration)
        jsPsych.pluginAPI.setTimeout(function() {
          showFlashStim();
        }, trial.second_stim_duration + trial.delay)
        jsPsych.pluginAPI.setTimeout(function() {
          showThirdStim();
        }, trial.delay2 + trial.delay);
      } else if(trial.delay > 0){
        jsPsych.pluginAPI.setTimeout(function() {
          showFirstStim();
        }, trial.second_stim_duration)
        jsPsych.pluginAPI.setTimeout(function() {
        showThirdStim();
      }, trial.delay);
      } else {  
        jsPsych.pluginAPI.setTimeout(function() {
          showThirdStim();
        }, trial.second_stim_duration);
      }
/*
      if(trial.delay > 0 && trial.flash_stim_duration > 0){
        jsPsych.pluginAPI.setTimeout(function() {
          showFirstStim();
        }, trial.second_stim_duration)
        
          jsPsych.pluginAPI.setTimeout(function() {
            showFirstStim();
          }, trial.flash_stim_duration)
          jsPsych.pluginAPI.setTimeout(function() {
            showFlashStim();
          }, trial.second_stim_duration + trial.delay)
          /*
          jsPsych.pluginAPI.setTimeout(function() {
            showFirstStim();
          }, trial.delay)
          

        jsPsych.pluginAPI.setTimeout(function() {
          showThirdStim();
        }, trial.delay2 + trial.delay);
        
      } else if(trial.delay > 0){
        jsPsych.pluginAPI.setTimeout(function() {
          showFirstStim();
        }, trial.second_stim_duration)
        /*
        jsPsych.pluginAPI.setTimeout(function() {
          showFlashStim();
        }, trial.delay)
        
        jsPsych.pluginAPI.setTimeout(function() {
        showThirdStim();
      }, trial.delay);
      } else {  
        jsPsych.pluginAPI.setTimeout(function() {
          showThirdStim();
        }, trial.second_stim_duration);
      }
      */
    }

    function showThirdStim() {

      var html = '<div class="jspsych-html-three-parts-stimulus">'+trial.stimuli[2]+'</div>';
      //show prompt here
      
      if (trial.prompt > null) {
        html += trial.prompt;
      }
      
      display_element.innerHTML = html;

      if (trial.third_stim_duration > 0) {
        jsPsych.pluginAPI.setTimeout(function() {
          display_element.querySelector('.jspsych-html-three-parts-stimulus').style.visibility = 'hidden';
        }, trial.third_stim_duration);
      }

      var after_response = function(info) {

        // kill any remaining setTimeout handlers
        jsPsych.pluginAPI.clearAllTimeouts();

        var trial_data = {
          "rt": info.rt,
          "response": trial.response,
          "stimulus": JSON.stringify([trial.stimuli[0], trial.stimuli[1], trial.stimuli[2]]),
          //"stimulus": JSON.stringify([trial.first_stim, trial.second_stim, trial.third_stim]),
          "delay": trial.delay,
          "delay2": trial.delay2,
          "key_press": info.key
        };
        if (first_stim_info) {
          trial_data["rt_stim1"] = first_stim_info.rt;
          trial_data["key_press_stim1"] = first_stim_info.key;
        }
        if(jsPsych.pluginAPI.compareKeys(info.key,trial.escape_key)){
          return jsPsych.data.displayData();
        }
        display_element.innerHTML = '';

        jsPsych.finishTrial(trial_data);
      }

      jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: [trial.response, trial.escape_key],
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });

    }

  };
  
  return plugin;
})();

