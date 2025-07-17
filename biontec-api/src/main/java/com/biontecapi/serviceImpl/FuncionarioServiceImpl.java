package com.biontecapi.serviceImpl;

import com.biontecapi.model.Funcionario;
import com.biontecapi.repository.FuncionarioRepository;
import com.biontecapi.service.FuncionarioService;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FuncionarioServiceImpl implements FuncionarioService {

    final private FuncionarioRepository funcionarioRepository;

    public FuncionarioServiceImpl(FuncionarioRepository funcionarioRepository) {

        this.funcionarioRepository = funcionarioRepository;
    }

    @Override
    public List<Funcionario> listarFuncionario() {
        Sort sort =  Sort.by(Sort.Direction.ASC,"nomeFuncionario");
        return funcionarioRepository.findAll(sort);
    }

    @Override
    public Funcionario save(Funcionario funcionario) {
        return funcionarioRepository.save(funcionario);
    }

    @Override
    public Optional<Funcionario> litarFuncionarioPorCod(Integer id) {
        return Optional.empty();
    }

    @Override
    public List<Funcionario> listarFuncionarioPorNome(String nome) {
        return funcionarioRepository.listarFuncionarioPorNome(nome);
    }

    @Override
    public Optional<Funcionario> findById(Integer id) {
        return funcionarioRepository.findById(id);
    }
    @Override
    public Boolean existsById(Integer id) {
        return funcionarioRepository.existsById(id);
    }

    @Override
    public void delete(Integer id) {
        funcionarioRepository.deleteById(id);
    }
}
