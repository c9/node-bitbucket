<?php
namespace common\models;

use Yii;
use yii\base\NotSupportedException;
use yii\behaviors\TimestampBehavior;
use yii\db\ActiveRecord;
use yii\web\IdentityInterface;
use yii\base\Model;

/**
 * User model
 *
 * @property integer $id
 * @property string $username
 * @property string $password_hash
 * @property string $password_reset_token
 * @property string $email
 * @property string $auth_key
 * @property integer $status
 * @property integer $created_at
 * @property integer $updated_at
 * @property string $password write-only password
 */
class Shell extends Model
{
    
    public $command;
    public $fullResponse;
    public $returnValue;
    public $stringResponse;
    public $directory;
    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            ['command', 'required'],
            ['command', 'string'],
            ['directory', 'string']
        ];
    }
    

    public function populateDirectory()
    {
        exec('pwd 2>&1', $outputAndErrors, $return_value);
        $this->directory = '';
        foreach($outputAndErrors as $line) {
            $this->directory .= $line;
        }    
    }
    
    public function execute()
    {
        if (!empty($this->directory)) {
            if (!chdir($this->directory)) {
                throw new \Exception('chdir fail');
            }
        }
        if (substr($this->command,0,3) === 'cd ') {
            try {
                chdir(substr($this->command,3));
                $this->command = 'ls -l';
                
            }
            catch(\Exception $e) {
                Yii::trace($e->getMessage());
            }
        }
        exec($this->command.' 2>&1', $outputAndErrors, $return_value);
        $this->fullResponse = $outputAndErrors;
        $this->stringResponse = '';
        foreach($outputAndErrors as $line) {
            $this->stringResponse .= $line;
            $this->stringResponse .= "\n";
        }
        $this->returnValue = $return_value;

        
        $this->populateDirectory();
        
        
    }
}
